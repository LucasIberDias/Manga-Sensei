import re
import sys
import json
import io
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from time import sleep
from selenium.webdriver.chrome.options import Options

# Garante que o print funcione com acentuação (ç, ã, é etc.) no Windows
sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")


def _opcoes_headless():
    opcoes = Options()
    opcoes.add_argument("--headless=new")
    opcoes.add_argument("--disable-gpu")
    opcoes.add_argument("--no-sandbox")
    opcoes.add_argument("--disable-dev-shm-usage")
    opcoes.add_argument("--window-size=1920,1080")

    # --- Anti-detecção de headless ---
    # Muitos sites entregam uma página diferente (vazia, bloqueada, captcha)
    # quando detectam que o Chrome está rodando em modo automação/headless.
    opcoes.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
    opcoes.add_argument("--disable-blink-features=AutomationControlled")
    opcoes.add_experimental_option("excludeSwitches", ["enable-automation"])
    opcoes.add_experimental_option("useAutomationExtension", False)

    return opcoes


def _salvar_diagnostico(driver, nome_arquivo):
    """Salva screenshot + HTML da página no momento da falha, para diagnóstico."""
    try:
        driver.save_screenshot(f"{nome_arquivo}.png")
        with open(f"{nome_arquivo}.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
    except Exception:
        pass


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"erro": "Nome do mangá não informado"}))
        sys.exit(1)

    nome_pesquisado = sys.argv[1]
    driver = webdriver.Chrome(options=_opcoes_headless())

    # Remove o indicador "navigator.webdriver" que denuncia automação
    try:
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": """
                Object.defineProperty(navigator, 'webdriver', {get: () => undefined})
                """
            },
        )
    except Exception:
        pass

    try:
        # 1 - Entra no site
        driver.get("https://mundosinfinitos.com.br/")
        sleep(2)

        # 2 - Entra na barra de pesquisa
        # O site tem 2 campos de busca: "search_txt" (desktop, visível em telas
        # grandes) e "search2_txt" (mobile, visível em telas pequenas). Como
        # definimos uma janela grande (1920x1080) para o Chrome, a versão
        # visível é a de DESKTOP. Usar o ID errado aqui causa timeout, pois o
        # elemento existe no HTML mas está escondido (display:none) por CSS.
        barra = WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.ID, "search_txt"))
        )

        # 3 - Coloca o mangá pesquisado
        barra.clear()
        barra.send_keys(nome_pesquisado)
        barra.send_keys(Keys.ENTER)

        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
            )
        except TimeoutException:
            _salvar_diagnostico(driver, "diagnostico_busca")
            print(json.dumps({
                "erro": (
                    f"Nenhum resultado encontrado (ou bloqueio de acesso) "
                    f"para '{nome_pesquisado}'. Veja diagnostico_busca.png/.html "
                    f"na pasta de execução para mais detalhes."
                )
            }, ensure_ascii=False))
            sys.exit(1)

        # 4 - Entra no primeiro mangá
        primeiro_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a"))
        )
        driver.get(primeiro_manga.get_attribute("href"))

        # 5 - Coloca todas as edições
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href*='/geek/colecao/']"))
        ).click()

        # 6 - Pega o título do mangá
        titulo_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "titulo-categoria"))
        )
        titulo = titulo_manga.text.strip()

        # 7 - Coloca em ordem crescente
        ordenador = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.ID, "ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao")
            )
        )
        select = Select(ordenador)
        select.select_by_value("8")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
        )
        sleep(2)

        # 8 - Entra no primeiro mangá
        nvm_primeiro_manga = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a"))
        )
        link = nvm_primeiro_manga.get_attribute("href")
        driver.get(link)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        sleep(2)

        # 9 - Pega capa
        imagens = driver.find_elements(By.CSS_SELECTOR, "button.owl-thumb-item img")
        if not imagens:
            imagem = ""
        elif len(imagens) >= 2:
            imagem = imagens[1].get_attribute("src")
        else:
            imagem = imagens[0].get_attribute("src")

        # 10 - Pega autor
        autores = driver.find_elements(By.XPATH, "//li[contains(., 'Autor')]//a")
        autor = next(
            (a.text.strip() for a in autores if a.text.strip()), "Desconhecido"
        )

        # 11 - Pega editora
        editoras = driver.find_elements(
            By.XPATH, "//li[strong[contains(text(),'Editora')]]/a"
        )
        editora = next(
            (e.text.strip() for e in editoras if e.text.strip()), "Desconhecida"
        )

        # 12 - Pega demografia
        demografias = driver.find_elements(
            By.XPATH, "//li[strong[contains(text(),'Demografia')]]/a"
        )
        demografia = next(
            (d.text.strip() for d in demografias if d.text.strip()), "Desconhecida"
        )

        # 12.1 - Pega gêneros
        generos_elementos = driver.find_elements(
            By.XPATH, "//li[strong[contains(text(),'Gênero')]]/a"
        )
        generos = [g.text.strip() for g in generos_elementos if g.text.strip()]

        # 13 - Pega quantidade de volumes
        driver.back()
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
        )
        sleep(2)

        elementos_numero_volume = [
            el for el in driver.find_elements(By.CLASS_NAME, "num-edicao")
            if el.is_displayed()
        ]
        qntd_volumes = len(elementos_numero_volume)

        numeros_volumes = [
            re.sub(r"[^A-Za-z0-9]", "", numero.text.strip())
            for numero in elementos_numero_volume
        ]

        elementos_volumes = [
            el for el in driver.find_elements(By.CSS_SELECTOR, ".box-produto .img-capa a")
            if el.is_displayed()
        ]
        links_volumes = [
            volume.get_attribute("href") for volume in elementos_volumes
        ]

        pares_vistos = set()
        numeros_volumes_unicos = []
        links_volumes_unicos = []
        for numero, link_v in zip(numeros_volumes, links_volumes):
            chave = (numero, link_v)
            if chave not in pares_vistos:
                pares_vistos.add(chave)
                numeros_volumes_unicos.append(numero)
                links_volumes_unicos.append(link_v)

        numeros_volumes = numeros_volumes_unicos
        links_volumes = links_volumes_unicos

        lista_volumes = []

        # 14, 15, 16 e 17
        for numero_volume, link_volume in zip(numeros_volumes, links_volumes):
            driver.get(link_volume)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            sleep(2)

            imagens_volume = driver.find_elements(
                By.CSS_SELECTOR, "button.owl-thumb-item img"
            )
            if not imagens_volume:
                capa_volume = ""
            elif len(imagens_volume) >= 2:
                capa_volume = imagens_volume[1].get_attribute("src")
            else:
                capa_volume = imagens_volume[0].get_attribute("src")

            isbn_bruto = driver.find_elements(
                By.XPATH, "//li[strong[contains(text(),'ISBN')]]"
            )
            isbn_texto = isbn_bruto[0].text if isbn_bruto else ""
            isbn = re.sub(r"\D", "", isbn_texto)

            lista_volumes.append({
                "numero": numero_volume,
                "capa": capa_volume,
                "isbn": isbn
            })

            driver.back()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
            )
            sleep(2)

        dados_manga = {
            "titulo": titulo,
            "capa": imagem,
            "autor": autor,
            "editora": editora,
            "demografia": demografia,
            "generos": generos,
            "quantidadeVolumes": qntd_volumes,
            "volumes": lista_volumes
        }

        print(json.dumps(dados_manga, ensure_ascii=False))

    except TimeoutException as e:
        _salvar_diagnostico(driver, "diagnostico_timeout")
        print(json.dumps({
            "erro": f"Timeout esperando elemento da página: {str(e).splitlines()[0]}"
        }, ensure_ascii=False))
        sys.exit(1)

    except Exception as e:
        _salvar_diagnostico(driver, "diagnostico_erro")
        print(json.dumps({"erro": f"Erro inesperado: {str(e)}"}, ensure_ascii=False))
        sys.exit(1)

    finally:
        # Garante que o Chrome sempre feche, mesmo em caso de erro
        # (evita acúmulo de processos chromedriver "zumbis")
        driver.quit()


if __name__ == "__main__":
    main()
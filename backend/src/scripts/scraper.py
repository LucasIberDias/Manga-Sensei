import re
import sys
import json

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from selenium.webdriver.chrome.options import Options

def _opcoes_headless():
    opcoes = Options()
    opcoes.add_argument("--headless=new")
    opcoes.add_argument("--disable-gpu")
    opcoes.add_argument("--no-sandbox")
    return opcoes

if len(sys.argv) < 2:
    print(json.dumps({"erro": "Nome do mangá não informado"}))
    sys.exit(1)

nome_pesquisado = sys.argv[1]

# 1 - Entra no site
driver = webdriver.Chrome(options=_opcoes_headless()) 
driver.get("https://mundosinfinitos.com.br/")
sleep(2)

# 2 - Entra na barra de pesquisa
barra = driver.find_element(By.ID, "search2_txt")

# 3 - Coloca o mangá pesquisado
barra.send_keys(nome_pesquisado)
barra.send_keys(Keys.ENTER)


WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
)

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
    (a.text.strip() for a in autores if a.text.strip()),
    "Desconhecido"
)

# 11 - Pega editora
editoras = driver.find_elements(
    By.XPATH,
    "//li[strong[contains(text(),'Editora')]]/a"
)

editora = next(
    (e.text.strip() for e in editoras if e.text.strip()),
    "Desconhecida"
)

# 12 - Pega demografia
demografias = driver.find_elements(
    By.XPATH,
    "//li[strong[contains(text(),'Demografia')]]/a"
)

demografia = next(
    (d.text.strip() for d in demografias if d.text.strip()),
    "Desconhecida"
)

# 12.1 - Pega gêneros (pode haver mais de um, então coletamos todos)
generos_elementos = driver.find_elements(
    By.XPATH,
    "//li[strong[contains(text(),'Gênero')]]/a"
)

generos = [g.text.strip() for g in generos_elementos if g.text.strip()]

# 13 - Pega quantidade de volumes
driver.back()

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
)

sleep(2)

# Elementos com o número do volume (badge azul "#1", "#2", etc. acima da capa)
# Filtramos apenas os visíveis, pois alguns sites duplicam elementos no HTML
# para versões desktop/mobile, deixando um deles escondido via CSS
elementos_numero_volume = [
    el for el in driver.find_elements(By.CLASS_NAME, "num-edicao")
    if el.is_displayed()
]
qntd_volumes = len(elementos_numero_volume)

# Extrai o número do volume, mantendo letras (edições especiais, ex: "10A")
# Remove apenas símbolos como "#" e espaços, mas preserva letras e dígitos
numeros_volumes = [
    re.sub(r"[^A-Za-z0-9]", "", numero.text.strip())
    for numero in elementos_numero_volume
]

# Coleta os links de todos os volumes (na mesma ordem dos números acima)
elementos_volumes = [
    el for el in driver.find_elements(By.CSS_SELECTOR, ".box-produto .img-capa a")
    if el.is_displayed()
]

links_volumes = [
    volume.get_attribute("href")
    for volume in elementos_volumes
]

# Remove duplicatas (alguns sites renderizam o mesmo produto duas vezes,
# por exemplo uma versão para desktop e outra para mobile escondida via CSS)
pares_vistos = set()
numeros_volumes_unicos = []
links_volumes_unicos = []

for numero, link in zip(numeros_volumes, links_volumes):
    chave = (numero, link)
    if chave not in pares_vistos:
        pares_vistos.add(chave)
        numeros_volumes_unicos.append(numero)
        links_volumes_unicos.append(link)

numeros_volumes = numeros_volumes_unicos
links_volumes = links_volumes_unicos

lista_volumes = []

# 14, 15, 16 e 17
for numero_volume, link_volume in zip(numeros_volumes, links_volumes):

    # Entra no volume
    driver.get(link_volume)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    sleep(2)

    # Pega capa do volume
    imagens_volume = driver.find_elements(
        By.CSS_SELECTOR,
        "button.owl-thumb-item img"
    )

    if not imagens_volume:
        capa_volume = ""
    elif len(imagens_volume) >= 2:
        capa_volume = imagens_volume[1].get_attribute("src")
    else:
        capa_volume = imagens_volume[0].get_attribute("src")

    # Pega ISBN
    isbn_bruto = driver.find_elements(
        By.XPATH,
        "//li[strong[contains(text(),'ISBN')]]"
    )

    isbn_texto = isbn_bruto[0].text if isbn_bruto else ""
    isbn = re.sub(r"\D", "", isbn_texto)

    lista_volumes.append({
        "numero": numero_volume,
        "capa": capa_volume,
        "isbn": isbn
    })

    # Volta para a lista
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

driver.quit()
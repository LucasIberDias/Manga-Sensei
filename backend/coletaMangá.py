import re
import requests

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from time import sleep

# 1 - Entra no site
driver = webdriver.Chrome()
driver.get("https://mundosinfinitos.com.br/")
sleep(2)

# 2 - Entra na barra de pesquisa
barra = driver.find_element(By.ID, "search2_txt")

# 3 - Coloca o mangá pesquisado
barra.send_keys(input("Digite o nome do manga:\n"))
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

# 13 - Pega quantidade de volumes
driver.back()

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
)

sleep(2)

# Elementos com o número do volume (badge azul "#1", "#2", etc. acima da capa)
elementos_numero_volume = driver.find_elements(By.CLASS_NAME, "num-edicao")
qntd_volumes = len(elementos_numero_volume)

# Extrai o número do volume, mantendo letras (edições especiais, ex: "10A")
# Remove apenas símbolos como "#" e espaços, mas preserva letras e dígitos
numeros_volumes = [
    re.sub(r"[^A-Za-z0-9]", "", numero.text.strip())
    for numero in elementos_numero_volume
]

# Coleta os links de todos os volumes (na mesma ordem dos números acima)
elementos_volumes = driver.find_elements(
    By.CSS_SELECTOR,
    ".box-produto .img-capa a"
)

links_volumes = [
    volume.get_attribute("href")
    for volume in elementos_volumes
]

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
    "quantidadeVolumes": qntd_volumes,
    "volumes": lista_volumes
}

response = requests.post(
    "http://localhost:3000/coletar",
    json=dados_manga
)

print(response.status_code)

driver.quit()
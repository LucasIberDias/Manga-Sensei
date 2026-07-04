# 1 - Entra no site
# 2 - Entra na barra de pesquisa
# 3 - Coloca o mangá pesquisado
# 4 - Entra no primeiro mangá
# 5 - coloca todas as ediçoes
# 6 - pega o titulo do mangá
# 7 - coloca em ordem crescente
# 8 - entra no primeiro mangá
# 9 - pega capa
# 10 - pega autor
# 11 - pega editora
# 12 - pega a demografia
# 13 - pega a quantidade de volumes

# 14 - entra no primeiro volume
# 15 - pega a capa do volume
# 16 - pega o isbn do volume
# 17 - faz novamente até coletar todos os volumes
# 18 - Cria o manga no banco de dados
# 19 - Coloca seus respectivos volumes

from selenium import webdriver;
from selenium.webdriver.common.by import By;
from selenium.webdriver.common.keys import Keys;
from time import sleep;
from selenium.webdriver.support.ui import WebDriverWait;
from selenium.webdriver.support import expected_conditions as EC;
from selenium.webdriver.support.ui import Select;

# 1 - Entra no site
driver = webdriver.Chrome();
driver.get('https://mundosinfinitos.com.br/');
sleep(2);

# 2 - Entra na barra de pesquisa
barra = driver.find_element(By.ID, "search2_txt");

# 3 - Coloca o mangá pesquisado
barra.send_keys(input('Digite o nome do manga: \n'));
barra.send_keys(Keys.ENTER);

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
);

# 4 - Entra no primeiro mangá
primeiro_manga = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a")));

driver.get(primeiro_manga.get_attribute("href"));

# 5 - coloca todas as ediçoes
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "a[href*='/geek/colecao/']"))
).click();

# 6 - pega o titulo do mangá
titulo_manga = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "titulo-categoria"))
);

print(titulo_manga.text);

# 7 - coloca em ordem crescente
ordenador = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao"))
);

select = Select(ordenador);
select.select_by_value("8");

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
);

sleep(2);

# 8 - entra no primeiro mangá (CORRETO)
nvm_primeiro_manga = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, ".box-produto .img-capa a"))
);

link = nvm_primeiro_manga.get_attribute("href");

driver.get(link);

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.TAG_NAME, "body"))
);

sleep(2);

# 9 - pega capa
imagens = driver.find_elements(By.CSS_SELECTOR, "button.owl-thumb-item img");

if not imagens:
    print("Nenhuma imagem encontrada");
    imagem = "";
else:
    if len(imagens) >= 2:
        imagem = imagens[1].get_attribute("src");
    else:
        imagem = imagens[0].get_attribute("src");

print(imagem);

# 10 - pega autor
autores = driver.find_elements(By.XPATH, "//li[contains(., 'Autor')]//a");

autor = next((a.text.strip() for a in autores if a.text.strip()), "Desconhecido");

print("Autor:", autor);

# 11 - pega editora
editoras = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'Editora')]]/a");

editora = next((e.text.strip() for e in editoras if e.text.strip()), "Desconhecida");

print("Editora:", editora);

# 12 - pega a demografia
demografias = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'Demografia')]]/a");

demografia = next((e.text.strip() for e in demografias if e.text.strip()), "Desconhecida");

print("Demografia:", demografia);

# 13 - pega a quantidade de volumes

driver.back();

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
);

sleep(2);

volumes = driver.find_elements(By.CLASS_NAME, "num-edicao");
qntd_volumes = len(volumes);

print("Quantidade de volumes:", qntd_volumes);

# A seguir os passos 14, 15, 16 e 17 são realizados
import re

# Coleta os links de todos os volumes antes de navegar (evita stale element)
elementos_volumes = driver.find_elements(By.CSS_SELECTOR, ".box-produto .img-capa a")
links_volumes = [v.get_attribute("href") for v in elementos_volumes]

lista_volumes = []

for i, link_volume in enumerate(links_volumes):

    # 14 - entra no volume
    driver.get(link_volume)

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )
    sleep(2)

    # 15 - pega a capa do volume (sempre a segunda, se existir)
    imagens_volume = driver.find_elements(By.CSS_SELECTOR, "button.owl-thumb-item img")

    if not imagens_volume:
        capa_volume = ""
    elif len(imagens_volume) >= 2:
        capa_volume = imagens_volume[1].get_attribute("src")
    else:
        capa_volume = imagens_volume[0].get_attribute("src")

    # 16 - pega o isbn do volume (apenas números)
    isbn_bruto = driver.find_elements(By.XPATH, "//li[strong[contains(text(),'ISBN')]]")
    isbn_texto = isbn_bruto[0].text if isbn_bruto else ""
    isbn = re.sub(r"\D", "", isbn_texto)

    print(f"Volume {i+1} -> Capa: {capa_volume} | ISBN: {isbn}")

    lista_volumes.append({
        "capa": capa_volume,
        "isbn": isbn
    })

    # 17 - volta para a lista de volumes
    driver.back()

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "box-produto"))
    )
    sleep(2)

# 18 - cria o manga no banco de dados

# 19 - coloca seus respectivos volumes
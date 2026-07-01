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
# 12 - pega ano de lançamento
# 13 - pega o ultimo volume para saber a quantidade de volumes
# 14 - pega o status
# 15 - pega a demografia

# 16 - entra no primeiro volume
# 17 - pega a capa do volume
# 18 - pega o isbn do volume
# 19 - faz novamente até coletar todos os volumes

from selenium import webdriver;
from selenium.webdriver.common.by import By;
from selenium.webdriver.common.keys import Keys;
from time import sleep;
from selenium.webdriver.support.ui import WebDriverWait;
from selenium.webdriver.support import expected_conditions as EC;
from selenium.webdriver.support.ui import Select

# 1 - Entra no site
driver = webdriver.Chrome();
driver.get('https://mundosinfinitos.com.br/');
sleep(2);

# 2 - Entra na barra de pesquisa
barra = driver.find_element(By.ID, "search2_txt");

# 3 - Coloca o mangá pesquisado
barra.send_keys(input('Digite o nome do manga: \n'));
barra.send_keys(Keys.ENTER);
sleep(3);

# 4 - Entra no primeiro mangá
primeiro_manga = driver.find_element(By.CLASS_NAME, "box-produto");
driver.execute_script("arguments[0].scrollIntoView();", primeiro_manga);
sleep(1);
primeiro_manga.click();
sleep(2);

# 5 - coloca todas as ediçoes
driver.find_element(By.CSS_SELECTOR, "a[href*='/geek/colecao/']").click();
sleep(3);

# 6 - pega o titulo do mangá
titulo_manga = driver.find_element(By.CLASS_NAME, "titulo-categoria");
print(titulo_manga.text);

# 7 - coloca em ordem crescente
ordenador = driver.find_element(By.ID, "ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao");
select = Select(ordenador);
select.select_by_value("8");

sleep(3);

# 8 - entra no primeiro mangá
primeiro_manga = driver.find_element(By.CLASS_NAME, "box-produto");

driver.execute_script("arguments[0].scrollIntoView();", primeiro_manga);

sleep(1);

primeiro_manga.click();

# 9 - pega capa
imagens = driver.find_elements(By.CSS_SELECTOR, "button.owl-thumb-item img")

# Esse IF else serve para verificar com qual imagem vou ficar, a segunda imagem é sempre a preferencia
if len(imagens) >= 2:
    imagem = imagens[1].get_attribute("src")  # segunda imagem
else:
    imagem = imagens[0].get_attribute("src")  # primeira imagem

print(imagem)

# 10 - pega autor
autores = driver.find_elements(By.XPATH, "//li[contains(., 'Autor')]//a")

autor = next(
    (a.text.strip() for a in autores if a.text.strip()),
    "Desconhecido"
)

print("Autor:", autor)

# 11 - pega editora
editoras = driver.find_elements(
    By.XPATH,
    "//li[strong[contains(text(),'Editora')]]/a"
)

editora = next(
    (e.text.strip() for e in editoras if e.text.strip()),
    "Desconhecida"
)

print("Editora:", editora)

# 12 - pega ano de lançamento

# 13 - pega o ultimo volume para saber a quantidade de volumes

# 14 - pega o status

# 15 - pega a demografia

# 16 - entra no primeiro volume

# 17 - pega a capa do volume

# 18 - pega o isbn do volume

# 19 - faz novamente até coletar todos os volumes
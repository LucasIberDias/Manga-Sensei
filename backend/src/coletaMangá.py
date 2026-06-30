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

# Primeiro passo
driver = webdriver.Chrome();
driver.get('https://mundosinfinitos.com.br/');
sleep(2);

# Segundo passo
barra = driver.find_element(By.ID, "search2_txt");

# Terceiro passo
barra.send_keys(input('Digite o nome do manga: \n'));
barra.send_keys(Keys.ENTER);
sleep(3);

# Quarto passo
primeiro_manga = driver.find_element(By.CLASS_NAME, "box-produto");
driver.execute_script("arguments[0].scrollIntoView();", primeiro_manga);
sleep(1);
primeiro_manga.click();
sleep(2);

# Quinto passo
driver.find_element(By.CSS_SELECTOR, "a[href*='/geek/colecao/']").click();
sleep(3);

# Sexto passo
titulo_manga = driver.find_element(By.CLASS_NAME, "titulo-categoria");
print(titulo_manga.text);

# Setimo passo
ordenador = driver.find_element(By.ID, "ConteudoBodyMaster_ConteudoCorpo_CtlResultadoBusca_ddlOrdenacao");
select = Select(ordenador);
select.select_by_value("8");

sleep(3);

# Oitavo passo
primeiro_manga = driver.find_element(By.CLASS_NAME, "box-produto");

driver.execute_script("arguments[0].scrollIntoView();", primeiro_manga);

sleep(1);

primeiro_manga.click();

sleep(10);
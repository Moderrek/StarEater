# 🌠 [Star Eater](https://ckziucodefest.pl/p/moderr/star-eater)

![GitHub License](https://img.shields.io/github/license/Moderrek/StarEater)


Mini-gra **Star Eater** polegająca na łapaniu punkcików _(gwiazd)_, które poruszają się według [prawa powszechnego ciążenia](https://pl.wikipedia.org/wiki/Prawo_powszechnego_ci%C4%85%C5%BCenia) symulowanego w grze.

Zagraj w grę [**TUTAJ**](https://moderrek.github.io/StarEater/)

## 🚶🏽‍♂️ Poruszanie się

Aby poruszać graczem (błękitnym kwadratem) należy poruszać się za pomocą strzałek albo WSAD'u

Gracz poprzed poruszanie się może zbierać _gwiazdy_, które zapewniają mu dodatkowy punkt

| Klawisz | Akcja         |
| ------- | ------------- |
| ←, A    | Ruch w lewo   |
| ↑, W    | Ruch w góre   |
| ↓, S    | Ruch w dół    |
| ➝, D    | Ruch w prawo |

### 🚀 Doładowanie

Na planszy gry widoczne jest **doładowanie** mieniące się na **pomarańczowo**/**zielono**.

Doładowanie zapewnia **przyspieszenie prędkości gracza** na określony czas.

### ✨ Gwiazdy

Gwiazdy to elementy gry, które gracz ma za zadanie zbierać (pochłaniać, niezaleznie od ich wielkości).

Każda zjedzona gwiazda zapewnia $\lceil \frac{masa}{10} \rceil$ pkt

$\lceil \frac{m}{10} \rceil, m = 0 \implies  pkt = 0$  
$\lceil \frac{m}{10} \rceil, m = 1 \implies  pkt = 1$  
$\lceil \frac{m}{10} \rceil, m = 10.1 \implies  pkt = 2$  
$\lceil \frac{m}{10} \rceil, m = 100 \implies  pkt = 10$  


W momencie kolizji gwiazd łączą się w większa gwiazdę

## 📸 Zrzuty ekranu

<div align="center">

<img src="./images/start.gif" width="345px" height="345px">

<img src="https://github.com/Moderrek/StarEater/assets/16192262/97bfb682-ffd3-473a-9ab7-641fa22ab2f8" width="315px" height="345px">

</div>

## 🕹️ Elementy w grze:
* **Animowane** **matematycznie**
* Poruszane za pomocą **prawa grawitacji** obliczanego za pomocą *FixedUpdate*
* Każdy element ma masę (oprócz gracza)

## ⏳ Czas rzeczywisty

### ✏️ *Update*
Funkcja wywoływana co klatkę. Wykorzystywana jest do **rysowania** obiektów. Tak jak animacje itp. Podczas obliczeń pod uwagę wzięta jest $deltaTime$. $deltaTime$ = *czas od poprzedniej klatki*.

### ⚛ *FixedUpdate*
Funkcja wywoływana co stały czas.

Interwał *FixedUpdate* jest mierzony na początku wczytania symulacji. Ilość milisekund pomiędzy pustymi klatkami zawsze będzie najmniejszym możliwym opóźnieniem równym $1000ms/Hz$ monitora Dla 60Hz co 16ms, Dla 240Hz 4ms.

$fixedTime = (1000 / Hz)$

FixedUpdate używany jest do przeprowadzania symulacji grawitacji.

## 🤝 Podziękowanie

Chciałem **bardzo podziękować** wszystkim, którzy zagłosowali na mnie ([CKZiU CodeFest](https://ckziucodefest.pl/)). Dziękuje ✨

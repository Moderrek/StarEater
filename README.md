# 🌠 [Star Eater](https://ckziucodefest.pl/p/moderr/star-eater)

Mini-gra **Star Eater** polegająca na łapaniu punkcików (gwiazd) jako gracz, które poruszają według [prawa powszechnego ciążenia](https://pl.wikipedia.org/wiki/Prawo_powszechnego_ci%C4%85%C5%BCenia).   

Zagraj w grę [**TUTAJ**](https://moderrek.github.io/StarEater/)

## 🚶🏽‍♂️ Poruszanie się

Aby poruszać graczem (błękitnym kwadratem) należy poruszać się za pomocą strzałek albo WSAD'u

Gracz poprzed poruszanie się może zbierać _gwiazdy_, które zapewniają mu dodatkowy punkt

| Klawisz | Akcja        |
| ------- | ------------ |
| ←, A    | Ruch w lewo  |
| ↑, W    | Ruch w góre  |
| ↓, S    | Ruch w dół   |
| ➝, D    | Ruch w prawo |

### 🚀 Doładowanie

Na planszy gry widoczne jest **doładowanie** mieniące się na **pomarańczowo**/**zielono**.

Doładowanie zapewnia **przyspieszenie prędkości gracza** na określony czas.

### ✨ Gwiazdy

Gwiazdy to elementy gry, które gracz ma za zadanie zbierać (pochłaniać, niezaleznie od ich wielkości).

Każda zjedzona gwiazda zapewnia **+1 pkt**

W momencie kolizji gwiazd łączą się w większa gwiazdę _(nadal zapewniają **1 pkt**, który łatwiej zdobyć)_

## 📸 Zrzuty ekranu

![Game Visualization](https://raw.githubusercontent.com/HegemonStudio/StarEater/main/start.gif)

## 🕹️ Elementy w grze:
* **Animowane** **matematycznie**
* Poruszane za pomocą **prawa grawitacji** obliczanego za pomocą *FixedUpdate*
* Każdy element ma masę (oprócz gracza)

## ⏳ Czas rzeczywisty

### *Update*
Funkcja wywoływana co klatkę. Wykorzystywana jest do rysowania obiektów. Tak jak animacje itp. Podczas obliczeń pod uwagę wzięta jest *deltaTime*. *deltaTime* = *czas od poprzedniej klatki*.

### *FixedUpdate*
Funkcja wywoływana co stały czas.

Interwał *FixedUpdate* jest mierzony na początku wczytania symulacji. Ilość milisekund pomiędzy pustymi klatkami zawsze będzie najmniejszym możliwym opóźnieniem równym *1000ms/Hz monitora* Dla 60Hz co 16ms, Dla 240Hz 4ms.

*const fixedTime* = *1000/Hz*


FixedUpdate używany jest do przeprowadzania symulacji grawitacji.
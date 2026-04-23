# Pixel Beast Mobile App
A mobile app deck builder for game Pixel Beast. Makes use of our [card api](https://github.com/NoahAdamMacDonald/card-api).

> [!NOTE]
> Originally created as a group. This version is a copy of the [original](https://github.com/AdamTBJohnston/GroupProjectCOMP208) 
> repo started by [Adam Johnston](https://github.com/AdamTBJohnston). This version builds upon it and is converted 
> typescript from the originals javascript.

## Group Members
_Adam Johnston_ - _Mathew Hatcher_ - _Noah MacDonald_ - _Silas Mahoney_

## Project Overview

This project makes use of our api [card api](https://github.com/NoahAdamMacDonald/card-api) to retrieve data.
AsyncStorage used for persistent local storage.

| Screens | Description |
| :--- | ---: |
| Home | Start screen that connects to the other remaining screens |
| My Decks | Displays all users decks and can route to deck details or deck creation |
| Deck builder | Search cards and add them to a deck to be saved |
| Card search | Search cards and filter by card type |
| Deck details | View cards in deck with options to delete cards, delete deck and edit deck |
| Card details | View cards details |

## Set up

> [!NOTE]
> Requires [expo](https://expo.dev/)

1. Clone repo

```bash
git clone https://github.com/NoahAdamMacDonald/Pixel-Beast-Typescript.git
```

2. Install dependencies

```bash
npm install
```

3. Run app

```bash
npx expo start
```


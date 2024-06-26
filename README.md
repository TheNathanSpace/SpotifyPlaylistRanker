# Spotify Playlist Ranker

Web app for users to rank tracks in a given Spotify playlist, eventually producing a ranked list showing their favorite
tracks.

## Stack

Front-End: React web app using MUI Joy UI

Back-End: Python Flask app

Database: SQLite

The plan is to containerize both into a single Docker container for easy deployment.

## User Interface

The UI will be built in React with MUI Joy UI components.

Figma mockup:

- [Design](https://www.figma.com/file/YcANdKT3sy9axCBssIUqvo/Spotify-Playlist-Ranker?type=design&node-id=0-1&mode=design)
- [Live Preview](https://www.figma.com/proto/YcANdKT3sy9axCBssIUqvo/Spotify-Playlist-Ranker?type=design&node-id=2-2&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=2%3A2)

![UI Mockup](data/ui_mockup.png)

## Database

The database will be a single, local SQLite database with several tables.

## Resources

- [Tom Scott: 1,204,986 Votes Decided: What Is The Best Thing?](https://www.youtube.com/watch?v=ALy6e7GbDRQ)
- [How Not to Sort by Average Rating](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html)
- [Python implementation of above (StackOverflow)](https://stackoverflow.com/a/10029645/7492795)
- [MUI Joy UI](https://mui.com/joy-ui/getting-started/)
- [AG Grid (table library)](https://www.ag-grid.com/react-data-grid/getting-started/)

## License

All rights reserved to the maximum possible extent.
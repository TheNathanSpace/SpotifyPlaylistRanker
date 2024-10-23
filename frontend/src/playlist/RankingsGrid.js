import {useEffect, useRef, useState} from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import PropTypes from "prop-types";
import GridImage from "./GridImage";
import GridCheckbox from "./GridCheckbox";

const RankingsGrid = (props) => {
    const [imageMap, setImageMap] = useState(new Map());
    const [colDefs, setColDefs] = useState([]);
    const imageMapFirstRender = useRef(true);
    const playlistTracksFirstRender = useRef(true);
    const [playlistTracks, setPlaylistTracks] = useState();

    const fetchURLImage = async (album_uri, image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return {album_uri: album_uri, image_url: url}
    }

    const base64ToBlobURL = async (playlistTracks) => {
        const promiseMap = new Map();
        playlistTracks.forEach(t => promiseMap.set(t.album_uri, fetchURLImage(t.album_uri, `data:image/png;base64,${t.album_image}`)));
        const imageMap = new Map();
        await Promise.allSettled(promiseMap.values()).then(async (promiseResults) => {
            promiseResults.forEach(r => imageMap.set(r.value.album_uri, r.value.image_url));
        });
        return imageMap;
    }

    useEffect(() => {
        if (playlistTracksFirstRender.current) {
            setPlaylistTracks(props.playlistTracks);
        }
    }, []);

    useEffect(() => {
        if (playlistTracksFirstRender.current) {
            playlistTracksFirstRender.current = false // toggle flag after first render/mounting
            return;
        }

        (async () => {
            const imageMap = await base64ToBlobURL(playlistTracks);
            setImageMap(imageMap);
        })();
    }, [playlistTracks]);

    useEffect(() => {
        if (imageMapFirstRender.current) {
            imageMapFirstRender.current = false // toggle flag after first render/mounting
            return;
        }

        setColDefs([
            {
                headerName: "Album Image", valueGetter: (t) => {
                    return {album_name: t.data.album_name, album_image: imageMap.get(t.data.album_uri)}
                }, cellRenderer: GridImage, flex: 1
            },
            {headerName: "Track", valueGetter: t => t.data.track_name, flex: 2},
            {headerName: "Album", valueGetter: t => t.data.album_name, flex: 2},
            {headerName: "Artist", valueGetter: t => t.data.artist_name, flex: 1.5},
            {headerName: "Ranking", valueGetter: t => Math.round(t.data.elo), flex: 1},
            {
                headerName: "Deleted", valueGetter: t => t.data, cellRenderer: GridCheckbox, flex: 0.5
            },
        ]);
    }, [imageMap]);

    return (
        // https://www.ag-grid.com/react-data-grid/getting-started/
        // wrapping container with theme & size
        <div
            className="ag-theme-quartz" // applying the grid theme
        >
            <AgGridReact
                rowData={playlistTracks}
                columnDefs={colDefs}
                domLayout={'autoHeight'}
            />
        </div>
    )
}

RankingsGrid.props = {
    playlistTracks: PropTypes.any
}

export default RankingsGrid;
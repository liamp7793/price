import { useEffect, useState } from "react";

export default function Dashboard() {
    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        fetch("/api/cameras")
            .then(res => res.json())
            .then(data => setCameras(data.cameras));
    }, []);

    return (
        <div>
            <h1>CCTV Live Feeds</h1>
            {cameras.map(([name, url]) => (
                <div key={name}>
                    <h3>{name}</h3>
                    <iframe src={url} width="400" height="300" />
                </div>
            ))}
        </div>
    );
}

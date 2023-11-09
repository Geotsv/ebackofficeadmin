import React from 'react';
import '../../css/App.css';

const Home = () => {
    return (
        <div className='homeImage' style={{ marginRight: '200px' }}>
            <img
                src={"/home/home.jpeg"}
                alt={"Homepage image"}
                style={{
                    width: '92%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </div>
    );
}

export default Home;

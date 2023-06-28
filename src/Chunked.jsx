import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function ChunkedData() {
    //const [chunks, setChunks] = useState([]);
    const [text, setText] = useState('chunked data comes here ..');

    const txtRef = useRef(null)

    useEffect(() => {
        //fetchData();
        txtRef.current.scrollTop = txtRef.current.scrollHeight;
    }, [text]);


    const url = 'http://127.0.0.1:8080/chunked_async';
    const fetchData = () => {
        setText("new chunked")

        // Chunked 통신을 수행하는 비동기 요청        
        const request = new XMLHttpRequest();
        request.open('POST', url);
        //request.setRequestHeader('Transfer-Encoding', 'chunked');
        request.onreadystatechange = () => {
            if (request.readyState === 3) {
                const chunk = request.responseText;
                //setChunks(prevChunks => [...prevChunks, chunk]);
                setText(txtRef.current.value + chunk);
            }
            if (request.readyState === 4) {
                const chunk = request.responseText;
                setText(chunk);
                // 요청 완료 후 추가 작업 수행
                console.log("요청 완료");
            }
        };
        request.send();
    };

    //fetch api
    const fetchData2 = () => {
        function onChunkedResponseComplete(result) {
            console.log("요청 완료", result)
        }
        function onChunkedResponseError(err) {
            console.error(err)
        }
        function processChunkedResponse(response) {
            var _text = '';
            var reader = response.body.getReader()
            var decoder = new TextDecoder();

            return readChunk();

            function readChunk() {
                return reader.read().then(appendChunks);
            }

            function appendChunks(result) {
                var chunk = decoder.decode(result.value);
                _text += chunk;
                setText(_text)
                if (result.done) {
                    return text;
                } else {
                    return readChunk();
                }
            }
        }

        const reqinfo = new Request(url, {
            method: 'POST'
        });

        fetch(reqinfo)
            .then(processChunkedResponse)
            .then(onChunkedResponseComplete)
            .catch(onChunkedResponseError)
    };

    //axios
    const fetchData3 = () => {
        axios.post(url)
            .then((response) => {
                setText(response.data)
                console.log("요청 완료", response.data)
            })
            .catch((error) => {
                console.log(error);
            })
    };

    function handleClick() {
        //fetchData();
        fetchData2();       //best and perfect
        //fetchData3();
    }

    return (
        <div>
            <button onClick={handleClick} style={{ marginTop: '20px', marginBottom: '20px' }}>Load Data</button>
            <div>
                <textarea ref={txtRef} value={text} readOnly={true} cols="100" rows="30"></textarea>
            </div>
            {/* <ul>
                {chunks.map((chunk, index) => (
                    <li key={index}>{chunk}</li>
                ))}
            </ul> */}
        </div>
    );
}

export default ChunkedData;
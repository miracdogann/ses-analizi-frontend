import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "../styles/css/duyguAnalizi.css"

function DuyguAnalizi() {
    // const sesMetni = "";

    const [audioList, setAudioList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sesMetni, setSesMetni] = useState("Text'e Çevirmek için bir ses dosyası seçiniz");
    const [displayMetin, setDisplayMetin] = useState(""); // Animasyonlu metin için state
    const [text_d_sonucu, setText_D_Sonucu] = useState({}); // JSON objesi
    const [ses_d_sonucu, setSes_D_Sonucu] = useState({});
    const [ort_sonuclar, setOrtalamaSonuclar] = useState({});

    const navigate = useNavigate();
    const textRef = useRef(""); // Animasyonlu metin için ref


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchAudioList();
        if (!user) {
            // Kullanıcı oturum açmamışsa anasayfaya yönlendir
            navigate('/');
        }
    }, [navigate]); // navigate yalnızca component mount olduğunda çalışacak

    const fetchAudioList = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/list_audio_files/${user.id}/`);
            const data = await response.json();
            if (response.ok) {
                setAudioList(data.audio_files);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Ses kayıtları yüklenirken hata oluştu:", err);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            alert("Lütfen bir ses kaydı seçin!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const data = { file_path: selectedFile.file_path }; // Dosya yolunu gönderiyoruz

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/duygu-analizi/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json" // Json Olarak Gönderiyoruz
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                setSesMetni(result.result);
                console.log('ses metni : ', result.result)
                console.log('duygu sonuçları : ', result.text_d_sonucu)
                console.log("türü :", typeof (result.text_d_sonucu))
                setText_D_Sonucu(result.text_d_sonucu);

                console.log('sesten gelen duygu sonuçları : ', result.ses_d_sonucu)
                console.log("türü :", typeof (result.ses_d_sonucu))
                setSes_D_Sonucu(result.ses_d_sonucu)
                setOrtalamaSonuclar(result.ortalama_sonuclar)
                animateText(result.result); // Metni animasyonlu şekilde yazdır
            } else {
                alert(data.error || 'Bir hata oluştu!');
            }
        } catch (err) {
            console.error("Ses dosyası analiz edilirken bir hata oluştu:", err);
            alert('Bir hata oluştu!');
        }
    };

    // Ses metnini adım adım ekleyen animasyon fonksiyonu
    const animateText = (text) => {
        let index = 0;
        textRef.current = ""; // Başlangıçta metin boş
        const updateText = () => {
            textRef.current += text[index];
            setDisplayMetin(textRef.current); // Yavaşça güncellenen metni state'e yaz
            index++;
            if (index < text.length) {
                requestAnimationFrame(updateText); // Animasyonu devam ettir
            }
        };
        requestAnimationFrame(updateText); // İlk adımı başlat
    };
    const emojiler = [
        {
            id:1 , emoji : '😔'
        },
        {
            id:2 , emoji : '🙂'
        },
        {
            id:3 , emoji : '🥰'
        },
        {
            id:4 , emoji : '😠'
        },
        {
            id:5, emoji : '😱'
        },
        {
            id:6 , emoji : '😯'
        },

    ]

    return (
        <>
            <Navigation />
            <div className="duygu-analizi">
                <h2>Duygu Analizi</h2>
                <div>
                    <h3>Ses Kayıtları</h3>
                    {audioList.length > 0 ? (
                        <ul>
                            {audioList.map((audio, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="audio"
                                            value={audio.file_path}
                                            onChange={() => setSelectedFile(audio)}
                                        />
                                        {audio.file_name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Henüz yüklenmiş bir ses kaydı bulunmuyor.</p>
                    )}
                </div>

                <button onClick={handleAnalyze} disabled={!selectedFile}>
                    Seçili Ses Dosyasını Metne Çevir Ve Duygu Analizini Yap!
                </button>

                <div className="ses-metni">
                    Ses Metni : {displayMetin} {/* Animasyonlu metni buraya yazdırıyoruz */}
                </div>

                <div className="texten-duygu-sonuclari">
                    <div>
                        <h3>Duygu Sonuçları</h3>
                        <ul>
                            {emojiler.map((emoji)=>(
                                <li  key={emoji.id}>{emoji.emoji}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Metinden Gelen Sonuçlar</h3>
                        <ul>
                            {Object.entries(text_d_sonucu).map(([key, value], index) => (
                                <li  key={index}>
                                    {key}: %{value}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Sesten Gelen Sonuçlar</h3>
                        <ul>
                            {Object.entries(ses_d_sonucu).map(([key, value], index) => (
                                <li key={index}>
                                    {key}:%{value}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Ortalama Sonuçlar</h3>
                        <ul>
                            {Object.entries(ort_sonuclar).map(([key, value], index) => (
                                <li key={index}>
                                    {key}:%{value}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>



            </div>
        </>
    );
}

export default DuyguAnalizi;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "../styles/css/konuAnalizi.css";

function KonuAnalizi() {
    const [audioList, setAudioList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [sesMetni, setSesMetni] = useState("Text'e Çevirmek için bir ses dosyası seçiniz");
    const [displayMetin, setDisplayMetin] = useState(""); // Animasyonlu metin için state
    const [kategori, setKategori] = useState(""); // Kategoriyi saklamak için yeni state
    const [kelime_sayisi , setKelimeSayisi] = useState('');
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
            const response = await fetch(`http://127.0.0.1:8000/api/konu_analizi_ve_texte_donusturme/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json" // Json Olarak Gönderiyoruz
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (response.ok) {
                setSesMetni(result.result);
                setKategori(result.konu); // API'den gelen kategoriyi state'e kaydet
                console.log('kelimse sayisi : ',result.kelime_sayisi);
                setKelimeSayisi(result.kelime_sayisi);
                animateText(result.result); // Metni animasyonlu şekilde yazdır
                console.log('Kategori: ', result.konu);
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

    return (
        <>
            <Navigation />
            <div className="konu-analizi">

                <h2>Konu Analizi ve Sesi Metne Çevirme</h2>
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
                    Seçili Ses Dosyasını Metne Çevir ve Konu Analizi Yap
                </button>

                <div className="ses-metni">
                    <div className="ses-metni-container">
                        <h3>Ses Metni :</h3>
                        <p>{displayMetin}</p> {/* Animasyonlu metni buraya yazdırıyoruz */}
                    </div>
                </div>
                {kelime_sayisi && (
                    <div className="kelime-sayisi">
                        <h4>Toplam Kelime Sayısı : {kelime_sayisi} </h4>
                    </div>
                )}

                {/* Kategori Dinamik Gösterim */}
                {kategori && (
                    <div className="kategori">
                        <h3>Konu  Analizi :</h3>
                        <p>{kategori} İle İlgili</p> {/* Kategoriyi burada dinamik olarak gösteriyoruz */}
                    </div>
                )}
            </div>
        </>
    );
}

export default KonuAnalizi;

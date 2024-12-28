import React, { useEffect } from "react";
import "../styles/css/grafikler.css";

function Grafikler({ analyzeCount }) {
    useEffect(() => {
        console.log("Grafikler güncelleniyor. Analiz sayısı:", analyzeCount);
    }, [analyzeCount]);

    const getDynamicUrl = (filename) => {
        return `/grafikler/${filename}?t=${new Date().getTime()}`; // Zaman damgası ekliyoruz
    };

    return (
        <>
            <h2>Grafikler</h2>
            <div className="grafik-container">
                <div className="grafik-item">
                    <img src={getDynamicUrl("orijinal_ses_dalgasi.png")} alt="Orijinal Ses Dalgası" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("frekans_spektrumu.png")} alt="Frekans Spektrumu" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("mel_spektrogram.png")} alt="Mel Spektrogram" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("mfcc_kisi_tanımlama.png")} alt="MFCC Kişi Tanımlama" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("ritim_analizi.png")} alt="Ritim Analizi" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("rms_enerji.png")} alt="RMS Enerji" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("zero_crossing_rate.png")} alt="Zero Crossing Rate" />
                </div>
                <div className="grafik-item">
                    <img src={getDynamicUrl("chroma_ozellikleri.png")} alt="Chrome Özellikleri" />
                </div>
            </div>
        </>
    );
}

export default Grafikler;

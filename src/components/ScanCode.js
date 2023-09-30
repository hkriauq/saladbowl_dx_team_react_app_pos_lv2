import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';
import './ScanCode.css';

const ScanCode = (props) => {
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    const initQuagga = async () => {
      try {
        // Quaggaの設定オブジェクトを定義
        const config = {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#preview'),
            constraints: {
              width: 450,
              height: 200,
            },
            // 検出範囲の指定: 上下30%は対象外
            area: { top: "30%", right: "0%", left: "0%", bottom: "30%" },
            singleChannel: false,
          },
          locator: {
            patchSize: 'medium',
            halfSample: true,
          },
          decoder: {
            readers: ['ean_reader'],
          },
          numOfWorkers: navigator.hardwareConcurrency || 4, // オプション名の誤りを修正
          locate: true,
        };

        // Quaggaを初期化
        await Quagga.init(config);

        // バーコードが検出された際の処理
        Quagga.onDetected((result) => {
          if (result && result.codeResult) {
            const scannedBarcode = result.codeResult.code;
            setBarcode(scannedBarcode);
            props.onBarcodeScanned(scannedBarcode);
          }
        });

        // Quaggaを開始
        Quagga.start();
      } catch (error) {
        console.error('Quagga initialization error:', error);
      }

      // コンポーネントがアンマウントされた時にQuaggaを停止
      return () => {
        Quagga.stop();
      };
    };

    initQuagga();
  }, [props]);

  return (
    <div className="scan-code-container">
      <hr />
      {barcode !== '' ? `バーコード：${barcode}` : 'スキャン中'}
      <hr />
      <div id="preview" className="preview"></div>
    </div>
  );
};

export default ScanCode;

import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import "./ScanCode.css";

const ScanCode = (props) => {
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const config = {
      inputStream: {
        type: "LiveStream",
        target: document.querySelector("#preview"),
        constraints: {
          width: { min: 450 },
          height: { min: 300 },
          facingMode: "environment",
          aspectRatio: { min: 1, max: 2 },
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      numOfWorkers: 2,
      frequency: 10,
      decoder: {
        readers: ["ean_reader"],
      },
      locate: true,
    };

    Quagga.init(config, (err) => {
      if (err) {
        console.log(err, "error msg");
      }
      Quagga.start();
      return () => {
        Quagga.stop();
      };
    });

    //detecting boxes on stream
    Quagga.onProcessed((result) => {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    // バーコードが検出された際の処理
    // Quagga.onDetected((result) => {
    //   if (result && result.codeResult) {
    //     const scannedBarcode = result.codeResult.code;
    //     setBarcode(scannedBarcode);
    //     props.onBarcodeScanned(scannedBarcode);
    //   }
    // });

    Quagga.onDetected(detected);
  }, []);

  const detected = (result) => {
    console.log(result.codeResult.code);
    if (result && result.codeResult) {
      const scannedBarcode = result.codeResult.code;
      setBarcode(scannedBarcode);
      props.onBarcodeScanned(scannedBarcode);
    }
  };

  return (
    <div className="scan-code-container">
      <hr />
      {barcode !== "" ? `バーコード：${barcode}` : "スキャン中"}
      <hr />
      <div id="preview" className="preview"></div>
    </div>
  );
};

export default ScanCode;

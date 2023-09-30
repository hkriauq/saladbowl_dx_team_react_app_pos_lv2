import React, { useState , useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import CartItems from './components/CartItems';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ScanCode from './components/ScanCode';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';


function App() {
  const [inputCode, setInputCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errorMessage1, setErrorMessage1] = useState(""); 
  const [errorMessage2, setErrorMessage2] = useState(""); 
  const [isTotalAmountModalOpen, setTotalAmountModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // スキャン中かどうかのステート
  const [showCodeScan, setShowCodeScan] = useState(false); // バーコード読み込みを表示するステート
  const navigate = useNavigate();


  //1. /login
  // 登録ボタンをクリックしたときの関数
  const handleRegister = () => {
    // ここで必要な登録処理を行う
    // 登録処理が成功した場合に画面遷移
    navigate("/app");
  };

  //2. /app
  // 「中止する」ボタンをクリックしたときのハンドラ
  const handleCancelScanClick = () => {
    setIsScanning(false); // スキャン中フラグをクリア
    setShowCodeScan(false); // バーコード読み込みを非表示
  };

  // 商品コードを入力した時の関数
  const handleCodeChange = (event) => {
    const inputValue = event.target.value;
    const numericInputValue = inputValue.replace(/[^0-9]/g, "");
    setInputCode(numericInputValue);
    setErrorMessage1("");
    setErrorMessage2("");
  };

  // 「読み込む」を押した時の関数
  const handleSearch = () => {
    const codeToSearch = inputCode;

    // FastAPIのエンドポイントURLを設定
    const apiUrl = `http://localhost:8000/product/?code=${codeToSearch}`;
  
    // axiosを使用してFastAPIにリクエストを送信
    axios.get(apiUrl)
      .then(response => {
        const productData = response.data;
        if (productData) {
          setSelectedProduct(productData);
          setErrorMessage1("");
        } else {
          setSelectedProduct(null);
          setErrorMessage1("登録されていない商品です");
        }
      })
      .catch(error => {
        console.error('エラー:', error);
      });
  };

  // 「商品を追加する」を押した時の関数
  const handleAddToCart = () => {
    if (selectedProduct) {
      const newItem = {
        id: selectedProduct.prd_id,
        code:selectedProduct.prd_cd,
        product: selectedProduct.prd_name,
        price: selectedProduct.prd_price,
        quantity: 1, 
      };
      const Product = {
        prd_id: selectedProduct.prd_id,
        prd_cd: selectedProduct.prd_cd,
        prd_name: selectedProduct.prd_name,
        prd_price: selectedProduct.prd_price,
      };
      setCartItems(prevItems => [...prevItems, newItem]);
      setProductList(prevItems => [...prevItems, Product]);
      setSelectedProduct(null);
      setInputCode("");
      setErrorMessage2("");
    }
  };

  // 合計金額を計算する関数
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // FastAPIの購入時のPOSTエンドポイントURLを設定
  const api_postUrl = "http://localhost:8000/purchase/";
  
  // 「購入ボタン」を押したときの関数
  const handlePurchase = () => {
    // ポスト処理　True:モーダル表示、False:エラー処理
    axios
      .post(api_postUrl, productList)
      .then((response) => {
        const result = response.data;
        if (result.check) {
          if(result.total_amount === 0){
            setErrorMessage2("商品がカートに入っていません");
          }
          else{
            setTotalAmount(result.total_amount)
            setTotalAmountModalOpen(true);
            setErrorMessage2("");
          }
        } else {
          setErrorMessage2("計算できませんでした");
        }
      })
      .catch(error => {
        console.error('エラー:', error);
      });
  };
  
  // ポップアップを閉じるときに入力内容をクリアする関数
  const handleCloseModal = () => {
    setTotalAmountModalOpen(false);
    setTotalAmount(0);
    setInputCode("");
    setSelectedProduct(null);
    setCartItems([]);
    setProductList([]); 
  };


  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          Step4 サラダボウル POSアプリ
        </div>
      </header>

      <body className="App-body">
        <Routes>
          <Route 
            path="/login" 
            element={
                <LoginForm onRegister={handleRegister} />
            }
          />

          <Route
            path="/app"
            element={
              <>
                <div className="Container_code">
                  <h5>商品コード入力</h5>
                  <input
                    type="text"
                    id="productCode"
                    value={inputCode}
                    onChange={handleCodeChange}
                  />
                  <Button variant="contained" onClick={handleSearch}>読み込む</Button>
                  <Button variant="contained" onClick={() => {
                    setShowCodeScan(true); 
                    setIsScanning(true); 
                  }}>スキャンする</Button>
                </div>

                {showCodeScan && (
                  <div className="Container_codeScan">
                  <h5>バーコード読み込み</h5>
                  {isScanning ? (
                      <ScanCode
                        onBarcodeScanned={(barcode) => {
                        }}
                      />
                    ) : (
                      <div>
                        <h5>なんで表示されないのーーー！</h5>
                      </div>
                  )}
                      <Button variant="contained" onClick={handleCancelScanClick}>中止する</Button>
                  </div>
                )}

                <div className="Container_add">
                  <h5>読み込んだ商品</h5>
                  {selectedProduct && (
                    <div className="Container_code_product">
                      <h5>{selectedProduct.prd_name}</h5>
                      <h5>{selectedProduct.prd_price}円</h5>
                    </div>
                  )}
                  {errorMessage1 && <p style={{ color: "red" }}>{errorMessage1}</p>} 
                  <Button variant="contained" onClick={handleAddToCart}>商品を追加する</Button>
                </div>


                <div className="Container_cart">
                  <h5>購入リスト</h5>
                  <CartItems cartItems={cartItems} totalAmount={calculateTotalAmount()} />
                  {errorMessage2 && <p style={{ color: "red" }}>{errorMessage2}</p>}
                  <Button variant="contained" onClick={handlePurchase}>購入する</Button>
                </div>

                {isTotalAmountModalOpen && (
                    <div className="TotalAmountModal">
                      <div className="TotalAmountModalContent">
                        <h5>合計金額（税込）</h5>
                        <h5>{totalAmount}円</h5>
                        <h5>Thank You<FavoriteIcon/></h5>
                        <button onClick={handleCloseModal}>閉じる</button>
                      </div>
                    </div>
                  )}

              </>
            }
          />
        </Routes>
      </body>
    </div>
  );
}

export default App;
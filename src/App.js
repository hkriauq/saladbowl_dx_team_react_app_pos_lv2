import React, { useState , useEffect } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import CartItems from './components/CartItems';
import ScanCode from './components/ScanCode';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import { BrowserRouter as  Router , Route, Routes, useNavigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import Header from './components/Header';
import AdGallery from './components/AdGallery';
//import FavoriteIcon from '@mui/icons-material/Favorite';



function App() {
  const [inputCode, setInputCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage1, setErrorMessage1] = useState(""); 
  const [isScanning, setIsScanning] = useState(false);
  const [showCodeScan, setShowCodeScan] = useState(false);
  const [barcodeFromScanCode, setBarcodeFromScanCode] = useState("");
  const axiosInstance = axios.create({withCredentials: true});
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [formValues, setFormValues] = useState({ username: '' }); 
  const navigate = useNavigate();
  //CartItems用
  //const [productList, setProductList] = useState([]);
  //const [errorMessage2, setErrorMessage2] = useState(""); 
  //const [totalAmount, setTotalAmount] = useState(0);
  //const [total_amount_ex_tax, setTotalAmountExTax] = useState(0);
  //const [isTotalAmountModalOpen, setTotalAmountModalOpen] = useState(false);


  //1. login
  // ログインボタンをクリックしたときの関数
  const handleRegister1 = () => {
    navigate("/app");
  };
  // 新規登録ボタンをクリックしたときの関数
  const handleRegister2 = () => {
    navigate("/");
  };
  // 新規登録が成功した際に isLoggedIn を true にし、ユーザー名を設定
  const handleRegister3 = (username) => {
    setIsLoggedIn(true);
    setFormValues({ username });
  };
  // ログインが成功した際に isLoggedIn を true にし、ユーザー名を設定
  //const handleRegister4 = (username) => {
    //setIsLoggedIn(true);
    //setFormValues({ username });
  //};


  //2. app
  // 「スキャンする」ボタンをクリックしたときの関数
  const handleScanClick = () => {
    setShowCodeScan(true);
    setIsScanning(true);
    setInputCode(""); 
  };

  // 「中止する」ボタンをクリックしたときの関数
  const handleCancelScanClick = () => {
    setIsScanning(false);
    setShowCodeScan(false);
  };

  useEffect(() => {
    if (barcodeFromScanCode) {
      // barcodeFromScanCode の値が得られた場合、inputCode にセット
      setInputCode(barcodeFromScanCode);
      setShowCodeScan(false);
    } else {
      // barcodeFromScanCode の値が得られない場合、入力可能にする
      setInputCode(""); 
    }
  }, [barcodeFromScanCode]);


  // 商品コードを入力した時の関数
  const handleCodeChange = (event) => {
    const inputValue = event.target.value;
    const numericInputValue = inputValue.replace(/[^0-9]/g, "");
    setInputCode(numericInputValue);
    setErrorMessage1("");
    setIsScanning(false);
    setShowCodeScan(false);
  };

  // 「読み込む」を押した時の関数
  const handleSearch = () => {
    const codeToSearch = inputCode;

    // FastAPIのエンドポイントURLを設定
    const apiUrl = `http://localhost:8000/product/?code=${codeToSearch}`;
    //const apiUrl = `https://webapp-class1to4-6.azurewebsites.net/product/?code=${codeToSearch}`;
  
 
    // axiosを使用してFastAPIにリクエストを送信
    axios.get(apiUrl)
      .then(response => {
        const productData = response.data;
        if (productData) {
          setSelectedProduct(productData);
          setErrorMessage1("");
          setIsScanning(false);
          setShowCodeScan(false);
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
      //const Product = {
        //prd_id: selectedProduct.prd_id,
        //prd_cd: selectedProduct.prd_cd,
        //prd_name: selectedProduct.prd_name,
        //prd_price: selectedProduct.prd_price,
      //};
      // カートに商品データを追加
      setCartItems(prevItems => [...prevItems, newItem]);
      //setProductList(prevItems => [...prevItems, Product]);
      setSelectedProduct(null);
      setIsScanning(false);
      setInputCode("");
    }
  };

  // CartItems.jsに引越し
  // 合計金額を計算する関数
  //const calculateTotalAmount = () => {
    //return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  //};

  // FastAPIの購入時のPOSTエンドポイントURLを設定
  //const api_postUrl =  "http://localhost:8000/purchase/";
  //const api_postUrl = "https://webapp-class1to4-6.azurewebsites.net/purchase/";

  // 「購入ボタン」を押したときの関数
  //const handlePurchase = () => {
    // ポスト処理　True:モーダル表示、False:エラー処理
    //axiosInstance
      //.post(api_postUrl, productList)
      //.then((response) => {
        //const result = response.data;
        //if (result.check) {
          //if(result.total_amount === 0){
            //setErrorMessage2("商品がカートに入っていません");
          //}
          //else{
            //setTotalAmount(result.total_amount);
            //setTotalAmountExTax(result.total_amount_ex_tax);
            //setTotalAmountModalOpen(true);
            //setErrorMessage2("");
          //}
        //} else {
          //setErrorMessage2("計算できませんでした");
        //}
      //})
      //.catch(error => {
        //console.error('エラー:', error);
      //});
  //};
  
  // ポップアップを閉じるときに入力内容をクリアする関数
  //const handleCloseModal = () => {
    //setTotalAmountModalOpen(false);
    //setTotalAmount(0);
    //setInputCode("");
    //setSelectedProduct(null);
    //setCartItems([]);
    //setProductList([]); 
  //};

  
  return (
    <div className="App">
      <header className="App-header">
          <Header 
           isLoggedIn={isLoggedIn} 
           setIsLoggedIn={setIsLoggedIn}
           formValues={formValues}
           cartItemCount={cartItems.length} />
      </header>

      <div className="App-body">
       {/*画面遷移*/}
        <Routes>
          <Route 
            path="/login" 
            element={
                <LoginForm 
                 onRegister={handleRegister1}
                 isLoggedIn={isLoggedIn} 
                 formValues={formValues} 
                 />
            }
          />
          <Route 
            path="/" 
            element={
                <SignUp 
                 onRegister={handleRegister2} 
                 onChildData={handleRegister3} 
                 />
            }
          />
          <Route 
            path="/cart" 
            element={
                <CartItems 
                 cartItems={cartItems} 
                 onCartChange={setCartItems} />
            }
          />
          <Route
            path="/app"
            element={
              <>
              {/*商品コード入力*/}
                <div className="Container_code">
                  <h5>商品を探す</h5>
                  <input
                    type="text"
                    id="productCode"
                    value={inputCode}
                    onChange={handleCodeChange}
                  />
                  <Button variant="contained" onClick={handleSearch}>検索する</Button>
                  <Button variant="contained" onClick={handleScanClick}>スキャンする</Button>
                </div>

              {/*バーコード読み込み*/}
                {showCodeScan && (
                  <div className="Container_codeScan">
                  <h5>バーコード読み込み</h5>
                  {isScanning ? (
                      <ScanCode
                        onBarcodeScanned={(barcode) => {
                          setBarcodeFromScanCode(barcode);
                        }}
                      />
                    ) : (
                      <div>
                        <h5>読み込みに失敗しました</h5>
                      </div>
                  )}
                      <Button variant="contained" onClick={handleCancelScanClick}>中止する</Button>
                  </div>
                )}

              {/*選択した商品の情報表示*/}
                {selectedProduct && (
                <div className="Container_add">
                  <h5>選んだ商品</h5>
                  {selectedProduct && (
                    
                    <div className="Container_code_product">
                      <h5>{selectedProduct.prd_name}</h5>
                      <h5>{selectedProduct.prd_price}円</h5>
                    </div>
                  )}
                  {errorMessage1 && <p style={{ color: "red" }}>{errorMessage1}</p>} 
                  <Button variant="contained" onClick={handleAddToCart}>商品を追加する</Button>
                </div>
                )}

              {/*CartItem.jsに引越し*/}
                {/*<div className="Container_cart">
                  <h5>購入リスト</h5>
                  <CartItems cartItems={cartItems} totalAmount={calculateTotalAmount()} />
                  {errorMessage2 && <p style={{ color: "red" }}>{errorMessage2}</p>}
                  <Button variant="contained" onClick={handlePurchase}>購入する</Button>
                </div>

                {isTotalAmountModalOpen && (
                    <div className="TotalAmountModal">
                      <div className="TotalAmountModalContent">
                        <h5>合計金額</h5>
                        <h1>{totalAmount}円</h1>
                        <h5>（税抜{total_amount_ex_tax}円）</h5>
                        <h5>Thank You<FavoriteIcon/></h5>
                        <button onClick={handleCloseModal}>閉じる</button>
                      </div>
                    </div>
                 
                )}*/}

              {/*商品広告*/}
                <div className="Add_card">
                  <h5>あなたにおすすめの商品</h5>
                  <AdGallery/>
                </div>

              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
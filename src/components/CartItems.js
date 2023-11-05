import React, { useState } from 'react';
import './CartItems.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom'; 



function CartItems ({ cartItems , onCartChange }) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [total_amount_ex_tax, setTotalAmountExTax] = useState(0);
  const [errorMessage1, setErrorMessage1] = useState(""); 
  const [errorMessage2, setErrorMessage2] = useState(""); 
  const [errorMessage3, setErrorMessage3] = useState(""); 
  const [isTotalAmountModalOpen, setTotalAmountModalOpen] = useState(false);
  const axiosInstance = axios.create({withCredentials: true});
  const navigate = useNavigate();


  // 商品コードごとに数量計算
  const aggregatedItems = {};
  cartItems.forEach((item) => {
    if (aggregatedItems[item.product]) {
      aggregatedItems[item.product].quantity += item.quantity;
    } else {
      aggregatedItems[item.product] = { ...item };
    }
  });

  // 商品をID単位で削除する関数
  const handleRemoveItem = (itemId) => {
    // itemIdに一致する商品をカートから削除
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    onCartChange(updatedCartItems);
  };

  // 合計金額を計算する関数
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // FastAPIの購入時のPOSTエンドポイントURLを設定
  //const api_postUrl =  "http://localhost:8000/purchase/";
  const api_postUrl = "https://webapp-class1to4-6.azurewebsites.net/purchase/";

  // 「購入ボタン」を押したときの関数
  const handlePurchase = () => {
    // ポスト処理　True:モーダル表示、False:エラー処理
    if (Object.values(aggregatedItems).length === 0) {
      // カートが空の場合
      setErrorMessage1("商品がカートに入っていません");
    } else {
      // カートに商品がある場合
      setErrorMessage1(""); 

    // productList オブジェクトを作成し、cartItems から詰め込む
    const productList = cartItems.map((item) => {
      return {
        prd_id: item.id,
        prd_cd: item.code,
        prd_name: item.product,
        prd_price: item.price,
        //quantity: item.quantity,
      };
    });

    // ポスト処理　True:モーダル表示、False:エラー処理
    axiosInstance
      .post(api_postUrl, productList)
      .then((response) => {
        const result = response.data;
        if (result.check) {
            setTotalAmount(result.total_amount);
            setTotalAmountExTax(result.total_amount_ex_tax);
            setTotalAmountModalOpen(true);
            setErrorMessage2("");
            console.log("POST成功", response.data);
        } else {
            setErrorMessage2("計算できませんでした");
        }
      })
      .catch(error => {
        console.error('エラー:', error);
        //setErrorMessage3("購入時にエラーが発生しました");
        setTotalAmountModalOpen(true);
      });
    }
  };
  
  // ポップアップを閉じるときに入力内容をクリアする関数
  const handleCloseModal = () => {
    setTotalAmountModalOpen(false);
    setTotalAmount(0);
    setItems([]);
    onCartChange([]); 
  };


  return (
    <div className="Container_cartItems">
        <h5>購入リスト</h5>
        {Object.values(aggregatedItems).map((item) => (
          <div key={item.id} className="Container_cartItemsList">
            <p>{item.product}</p>
            <p>{item.price}円</p>
            <p>{item.quantity}個</p>
            <Button className="delete-button" variant="outlined" onClick={() => handleRemoveItem(item.id)}>削除</Button>
          </div>
        ))}
        
        <div className="TotalAmount">
          <h5>合計金額: {calculateTotalAmount()}円</h5>
          <h5>商品点数: {cartItems.length}点</h5>
        </div>

        <div className="Container_cartItems_Error">
            {errorMessage1 && <p style={{ color: "red" }}>{errorMessage1}</p>}
            {errorMessage2 && <p style={{ color: "red" }}>{errorMessage2}</p>}
            {errorMessage3 && <p style={{ color: "red" }}>{errorMessage3}</p>}
        </div>

        <div>       
          <Button variant="contained" onClick={handlePurchase}>
            購入する
          </Button>
          <Button variant="contained" onClick={() => navigate('/app')}>
            商品を選ぶ
          </Button>
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
          
          )}
    </div>
  );
};

export default CartItems;
/* global Omise */
import React, { useState } from "react";

const Checkout = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardName, setCardName] = useState("");

  const handleCheckout = () => {
    Omise.setPublicKey("YOUR_PUBLIC_KEY_HERE");

    Omise.createToken("card", {
      name: cardName,
      number: cardNumber,
      expiration_month: expiryMonth,
      expiration_year: expiryYear,
      security_code: securityCode,
    }, (statusCode, response) => {
      if (statusCode === 200) {
        console.log("Token created successfully:", response.id);
        // ส่ง token ไปยังเซิร์ฟเวอร์เพื่อทำการชำระเงิน
      } else {
        console.error("Token creation failed:", response);
      }
    });
  };

  return (
    <div>
      <h2>Checkout</h2>
      <input
        type="text"
        placeholder="Card Name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="MM"
        value={expiryMonth}
        onChange={(e) => setExpiryMonth(e.target.value)}
      />
      <input
        type="text"
        placeholder="YY"
        value={expiryYear}
        onChange={(e) => setExpiryYear(e.target.value)}
      />
      <input
        type="text"
        placeholder="Security Code"
        value={securityCode}
        onChange={(e) => setSecurityCode(e.target.value)}
      />
      <button onClick={handleCheckout}>Pay Now</button>
    </div>
  );
};

export default Checkout;

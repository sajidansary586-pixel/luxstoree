export function BankQRCode({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative"
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          border: "2px solid rgba(212,175,55,0.6)",
          boxShadow: "0 0 30px rgba(212,175,55,0.2)",
        }}
      >
        <img
          src="/bank-qr.png"
          alt="Bank QR Code"
          width={180}
          height={180}
          style={{ display: "block", objectFit: "contain" }}
        />
        <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: "#555", fontWeight: "600" }}>
          SCAN TO PAY
        </div>
      </div>
    </div>
  );
}

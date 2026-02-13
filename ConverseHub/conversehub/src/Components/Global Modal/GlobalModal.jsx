import '../Global Modal/GlobalModal.css'

export default function GlobalModal({ children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose} >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    )
}
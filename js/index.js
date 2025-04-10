
// Modal
window.onload = function (){
    const openBtn = document.getElementById("openBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const modalBg = document.querySelector(".bg-opacity");

    function openModal(){
        modalBg.style.display = "block";

        function closeModal (){
            modalBg.style.display = "none";
        }

        cancelBtn.onclick = closeModal;

        window.onclick = function (e){
            if(e.target === modalBg){
                closeModal();
            }
        }
    }
    openBtn.onclick = openModal;
}
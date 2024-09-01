import Swal from 'sweetalert2';
export  function AlertSuccess (title,description){
    return (
        Swal.fire({
            icon: 'success',
            title: title,
            text: description,
          })
    )
}

export  function AlertError (title,description){
    return (
        Swal.fire({
            icon: 'error',
            title: title,
            text: description
          })
    )
}

export  function AlertLoading (){
    Swal.fire({
        title: 'กำลังดำเนินการ',
        text: 'กรุณารอสักครู่...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
}
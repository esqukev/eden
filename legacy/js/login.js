const expresiones= {
    clave: /^(?=.*\d)(?=.*[A-Za-z]{8})[A-Za-z\d]{9}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}

function validarEmail(){
    if(!expresiones.correo.test(document.getElementById('correo').value)){
        document.getElementById('correo_error').className='formulario__input-error'
    }
    else{
        document.getElementById('correo_error').className='formulario__input-error_inactivo'
    }
}

function validarClave(){
    if(!expresiones.clave.test(document.getElementById('contraseña').value)){
        document.getElementById('clave_error').className='formulario__input-error'
    }
    else{
        document.getElementById('clave_error').className='formulario__input-error_inactivo'
    }
}

function validarClaveRepetida(){
    if(!expresiones.clave.test(document.getElementById('contraseña_confirmar').value)){
        document.getElementById('clave_error_confirmar').className='formulario__input-error'
    }
    else{
        document.getElementById('clave_error_confirmar').className='formulario__input-error_inactivo'
    }
    if(!(document.getElementById('contraseña').value==document.getElementById('contraseña_confirmar').value)){
        document.getElementById('clave_error_confirmar2').className='formulario__input-error'
    }
    else{
        document.getElementById('clave_error_confirmar2').className='formulario__input-error_inactivo'
    }
}
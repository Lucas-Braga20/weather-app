import axios from 'axios';

const baseUrl = 'http://ip-api.com/json/';

// IpAPI - Utilizada para consultar a localização do usuário através do Endereço IP.
// Não requer chave de acesso para uso não comercial.
// Documentação: https://ip-api.com/docs

export default {
    getGeolocation: function (callback) {
        const url = baseUrl;

        axios.get(url)
            .then(response => callback(response.data));
    }, 
};
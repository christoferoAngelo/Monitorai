import { Cloudinary } from "@cloudinary/url-gen";

// Inicializa a instância do Cloudinary com as suas credenciais
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dglfyhzto' // Substitua pelo Cloud Name do seu painel do Cloudinary
  }
});

export default cld;
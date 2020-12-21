import mongoose, {Schema} from 'mongoose';
const contactoSchema = new Schema({
    nombre:   { type: String, required: [true, 'El nombre es necesario'] },
    apellido:   { type: String, required: [true, 'El apellido es necesario'] },
    telefono:   { type: Number, required: [true, 'El telefono es necesario'] },
    email: { type: String,  required: [true, 'Email es necesario'] },
    direccion: { type: String,  required: [true, 'Direccion Requerida'] },
    //avatar: {type: String},
    usuarioId: String,
});

const Contacto = mongoose.model('contacto',contactoSchema);
export default Contacto;
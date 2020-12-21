import mongoose, {Schema} from 'mongoose';
const usuarioSchema = new Schema({
    rol: { type:String,maxlength:30, required:true},
    nombres: { type:String,maxlength:50, unique:true, required:true},
    apellidos: { type:String,maxlength:50, unique:true, required:true},
    telefono: { type:String, maxlength:8},
    email: { type:String, maxlength:50, unique:true, required:true},
    password: { type:String, maxlength:64, required:true},
    estado: { type:Number, default:1},
	createdAt: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('usuario',usuarioSchema);
export default Usuario;
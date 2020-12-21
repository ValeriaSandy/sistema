import mongoose, {Schema} from 'mongoose';
const eventoschema = new Schema(
  {
    nombre: {type: String},
    detalle:{type: String },
    inicio: {type: String },
    final: {type:String  },
    color: {type: String },
    usuarioId: String, },
);

const Evento = mongoose.model('evento', eventoschema);
export default Evento;

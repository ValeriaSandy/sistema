import mongoose, {Schema} from 'mongoose';
const eventoschema = new Schema({
    name: {type: String},
    details:{type: String },
    start: {type: String },
     end: {type:String  },
    color: {type: String },
    usuarioId: String, 
  });

const Evento = mongoose.model('evento', eventoschema);
export default Evento;

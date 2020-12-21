import mongoose, {Schema} from 'mongoose';
const notaschema = new Schema(
  {
    titulo: { type: String, required: true },
    descripcion:{type: String, },
    date:{type: Date, default: Date.now},
    usuarioId: { type: Schema.Types.ObjectId },
  }
);

const Nota = mongoose.model('nota', notaschema);
export default Nota;

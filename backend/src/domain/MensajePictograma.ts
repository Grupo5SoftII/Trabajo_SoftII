export class MensajePictograma {
  constructor(
    public id: number,
    public fecha: Date,
    public emisorId: number,
    public chatId: number,
    public pictogramaId: number
  ) {}
}

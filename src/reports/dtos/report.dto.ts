import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: string;

  // obj is a reference to the original report entity.
  // we then assign the value of obj.user.id to the new property (userId)
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}

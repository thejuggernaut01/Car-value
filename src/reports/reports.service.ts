import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    // when we call save on report, BTS, the repository is
    // going to extract just the user id from entire user
    // entity instance, and save the id automatically for us
    // inside reports table.
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        // checks if the difference between the lng (longitude)
        // column and the lng parameter falls within the range of -5 to 5.
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('approved IS TRUE')
        // Orders the results based on the difference between the
        // mileage column and the mileage parameter

        // This is useful if you want the results ordered by how
        // close the mileage is to a certain value.

        // ABS gives us the absolute value of the diff between the two
        // DESC sorts in descending order
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        // This is because orderBy does not take a parameter
        // object as a second argument
        .setParameters({ mileage })
        // Executes the query and retrieves the raw results as an
        // array of records (objects).
        .limit(3)
        .getRawOne()
    );
  }
}

import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { Role } from '~/enum';
import RoleGuard from '~/auth/guards/role-auth';
import { AppService } from '~/app.service';
@Controller('report')
export class AppController {
  constructor(private readonly appService: AppService) {}
  // eslint-disable-next-line prettier/prettier
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getTotalUser() {
    return this.appService.countTotalUsers();
  }

  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthGuard)
  @Get('/receipts')
  async getReportReceipt(@Query() query: any) {
    const data = {
      to: new Date(`${query.year}/01`),
      from: new Date(`${query.year}/12`),
    };
    return this.appService.reportReceipt(data);
  }
}

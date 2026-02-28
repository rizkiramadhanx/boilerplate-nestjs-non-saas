import { Injectable } from '@nestjs/common';
import { createSuccessResponse } from './common/type/response';

@Injectable()
export class AppService {
  getHello() {
    return createSuccessResponse('Hallo gantangan', {
      message: 'Hallo gantangan',
    });
  }
}

import { Schema } from 'express-validator'

import {
  VALIDATION_FILE_PATH,
} from '../../../constants/validation'

export const SIGNED_URL_SCHEMA: Schema = {
  filePath: VALIDATION_FILE_PATH('body'),
}

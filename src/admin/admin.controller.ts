import { Controller, UseGuards } from "@nestjs/common";;
import { AdminService } from "./admin.service";

@Controller('admin')
@UseGuards(
   
)
export class Admin {
    constructor(private readonly adminService: AdminService) { }


}






const {PrismaClient}=require("@prisma/client");const p=new PrismaClient();p.subcategory.update({where:{id:41},data:{categoryId:6}}).then(r=>console.log("OK:",r.name)).finally(()=>p.$disconnect())

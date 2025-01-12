import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FurnitureService } from "./furniture.entity";

@Entity("services")
export class Services {
    @PrimaryGeneratedColumn("uuid")
    serviceID?: string
    @Column({unique: true})
    Name?: string
    @Column()
    Image?: string
    @Column()
    Price?: number;
    @Column({select: false,default: true})
    Blocked?: boolean
    @ManyToOne(()=>FurnitureService,entity=>entity.Services,{
        onDelete: "CASCADE"
    })
    Service?: FurnitureService
}

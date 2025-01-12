import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Services } from "./services.entity";

@Entity("furniture-service")
export class FurnitureService {
    @PrimaryGeneratedColumn("uuid")
    serviceID!: string
    @Column({unique: true})
    serviceName!: string
    @Column({default: 0})
    serviceSellCount!: number
    @OneToMany(()=>Services,entity => entity.Service,{cascade: true})
    Services?: Services[]
}


import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
type FirstStep = "Кровать" | "Диван" | "Кресло" | "Стул" | "Банкетка" | "Пуфик"
type SecondStep = "Ткань" | "Кожа" | "Экокожа" | "Еще думаю..."
type ThirdStep = "В черте города" | "До 50 км от города" | "Более 50 км от города" | "До 20 км от города"
type FourdStep = "Работа + материал" | "Только работа"
type FiveStep = "Лифт есть" | "Лифта нету"

@Entity("calculate-entity")
export class CalculateEntity {
    @PrimaryGeneratedColumn("rowid")
    calculateId!: string
    @Column()
    calculatedPrice!: number
    @Column()
    StepOne!: FirstStep
    @Column()
    StepTwo!: SecondStep
    @Column()
    StepThree!: ThirdStep
    @Column()
    StepFour!: FourdStep
    @Column()
    StepFive!: FiveStep
}
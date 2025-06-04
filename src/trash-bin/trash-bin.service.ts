import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrashBin } from './entities/trash-bin.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateTrashBinDto } from './dto/create-trash-bin.dto';
import { UpdateTrashBinDto } from './dto/update-trash-bin.dto';

@Injectable()
export class TrashBinService {
  constructor(
    @InjectRepository(TrashBin)
    private readonly trashBinRepository: Repository<TrashBin>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTrashBinDto: CreateTrashBinDto): Promise<TrashBin> {
    const trashItem = this.trashBinRepository.create(createTrashBinDto);

    // If moving a project to trash, update its status to 2
    if (createTrashBinDto.projectId) {
      await this.projectRepository.update(
        createTrashBinDto.projectId,
        { statusId: 2 }
      );
      console.log(`Project ${createTrashBinDto.projectId} status updated to 2 (moved to trash)`);
    }

    return await this.trashBinRepository.save(trashItem);
  }

  async findAll(): Promise<TrashBin[]> {
    return await this.trashBinRepository.find({
      relations: ['project', 'diagram', 'user'],
      order: { deletedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TrashBin> {
    const trashItem = await this.trashBinRepository.findOne({
      where: { id },
      relations: ['project', 'diagram', 'user'],
    });

    if (!trashItem) {
      throw new NotFoundException(`Trash item with ID ${id} not found`);
    }

    return trashItem;
  }

  async findByUser(deletedBy: string): Promise<TrashBin[]> {
    return await this.trashBinRepository.find({
      where: { deletedBy },
      relations: ['project', 'diagram', 'user'],
      order: { deletedAt: 'DESC' },
    });
  }

  async findByProject(projectId: number): Promise<TrashBin[]> {
    return await this.trashBinRepository.find({
      where: { projectId },
      relations: ['project', 'diagram', 'user'],
      order: { deletedAt: 'DESC' },
    });
  }

  async findByDiagram(diagramId: number): Promise<TrashBin[]> {
    return await this.trashBinRepository.find({
      where: { diagramId },
      relations: ['project', 'diagram', 'user'],
      order: { deletedAt: 'DESC' },
    });
  }

  async update(id: number, updateTrashBinDto: UpdateTrashBinDto): Promise<TrashBin> {
    const trashItem = await this.findOne(id);
    Object.assign(trashItem, updateTrashBinDto);
    return await this.trashBinRepository.save(trashItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.trashBinRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Trash item with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<void> {
    // Get the trash item to find the associated project
    const trashItem = await this.findOne(id);

    // If restoring a project, update its status back to 1
    if (trashItem.projectId) {
      await this.projectRepository.update(
        trashItem.projectId,
        { statusId: 1 }
      );
      console.log(`Project ${trashItem.projectId} status updated to 1 (restored from trash)`);
    }

    // Remove from trash bin
    await this.remove(id);
  }

  async emptyTrash(deletedBy?: string): Promise<void> {
    if (deletedBy) {
      await this.trashBinRepository.delete({ deletedBy });
    } else {
      await this.trashBinRepository.clear();
    }
  }
}

import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { DiagramType } from '../../diagrams/entities/diagram-type.entity';
import { Diagram } from '../../diagrams/entities/diagram.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seed(dataSource: DataSource) {
  // Create users
  const userRepository = dataSource.getRepository(User);
  const users = [
    {
      id: uuidv4(),
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Admin User',
      isActive: true,
      isVerified: true,
    },
    {
      id: uuidv4(),
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      fullName: 'Regular User',
      isActive: true,
      isVerified: true,
    },
  ];

  const savedUsers = await userRepository.save(users);

  // Create diagram types
  const diagramTypeRepository = dataSource.getRepository(DiagramType);
  const diagramTypes = [
    { type: 'Class Diagram' },
    { type: 'Sequence Diagram' },
    { type: 'Use Case Diagram' },
    { type: 'Component Diagram' },
    { type: 'Package Diagram' },
  ];

  const savedDiagramTypes = await diagramTypeRepository.save(diagramTypes);

  // Create projects
  const projectRepository = dataSource.getRepository(Project);
  const projects = [
    {
      projectName: 'E-commerce System',
      userUUID: savedUsers[0].id,
    },
    {
      projectName: 'Banking Application',
      userUUID: savedUsers[1].id,
    },
  ];

  const savedProjects = await projectRepository.save(projects);

  // Create diagrams
  const diagramRepository = dataSource.getRepository(Diagram);
  const diagrams = [
    {
      name: 'User Management Class Diagram',
      idProject: savedProjects[0].id,
      type: savedDiagramTypes[0].id,
      version: 1,
      infoJson: {
        elements: [
          {
            id: 'user',
            type: 'class',
            name: 'User',
            attributes: ['id: string', 'email: string', 'password: string'],
            methods: ['login()', 'logout()'],
          },
        ],
      },
    },
    {
      name: 'Payment Sequence',
      idProject: savedProjects[0].id,
      type: savedDiagramTypes[1].id,
      version: 1,
      infoJson: {
        elements: [
          {
            id: 'payment',
            type: 'sequence',
            participants: ['User', 'PaymentGateway', 'Bank'],
            messages: [
              'processPayment()',
              'validateCard()',
              'confirmTransaction()',
            ],
          },
        ],
      },
    },
    {
      name: 'Banking Use Cases',
      idProject: savedProjects[1].id,
      type: savedDiagramTypes[2].id,
      version: 1,
      infoJson: {
        elements: [
          {
            id: 'banking',
            type: 'usecase',
            actors: ['Customer', 'Bank'],
            useCases: ['Transfer Money', 'Check Balance', 'Pay Bills'],
          },
        ],
      },
    },
  ];

  await diagramRepository.save(diagrams);

  console.log('Database seeded successfully!');
}


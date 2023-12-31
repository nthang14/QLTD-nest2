import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '~/users/schemas/users.schema';
import { Model } from 'mongoose';
import { Search } from '~/type';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';

@Injectable()
export class UsersService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    @InjectModel(Users.name) private readonly model: Model<UsersDocument>,
  ) {}

  async createUser(userPayload: Users) {
    const user = await this.model.create(userPayload);
    if (!user) {
      throw new NotFoundException('User create failed !');
    }
    return {
      data: user,
      statusCode: 201,
      message: 'User create successfully !',
    };
  }
  async getListUser(query?: any, searchQuery?: Search) {
    const limit = searchQuery?.limit || LIMIT_DEFAULT;
    const skip = ((searchQuery?.page || PAGE_DEFAULT) - 1) * limit;
    const users = await this.model.find(query).skip(skip).limit(limit).exec();
    const total = await this.model.find(query).count();
    const totalPage = Math.ceil(total / limit);
    if (!users) {
      throw new NotFoundException('Get user failed !');
    }
    return {
      data: users,
      total: total,
      totalPage: totalPage,
      currentPage: parseInt(skip.toString()),
      statusCode: 200,
      message: 'Get user successfully !',
    };
  }
  async getUserById(id: string) {
    const user = await this.model.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found !');
    }
    return {
      data: user,
      statusCode: 201,
      message: 'Get user successfully !',
    };
  }
  async updateUserById(id: string, userPayload: Users) {
    const user = await this.model
      .findByIdAndUpdate(id, userPayload, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User update failed !');
    }
    return {
      statusCode: 200,
      data: user,
      message: 'User updated successfully !',
    };
  }
  async changePassword(id: string, userPayload: any) {
    const user = await this.model
      .findByIdAndUpdate(id, {password: userPayload.password, first: false}, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('Change password failed !');
    }
    return {
      statusCode: 200,
      data: user,
      message: 'Change password successfully !',
    };
  }
  async updateUserStatusById(id: string, isActive: boolean) {
    const user = await this.model
      .findByIdAndUpdate(id, { isActive: isActive }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User update failed !');
    }
    return {
      statusCode: 200,
      data: user,
      message: 'User updated successfully !',
    };
  }
  async deleteUser(id: string) {
    const result = await this.model
      .findByIdAndUpdate(id, { isActive: false })
      .exec();
    const users = await this.model.find().exec();
    if (!!result) {
      return {
        data: users,
        message: 'User deleted successfully !',
        statusCode: 200,
      };
    } else {
      return {
        statusCode: 404,
        message: 'User deleted failed !',
      };
    }
  }
  async findUserByEmail(username: string) {
    const user = await this.model.findOne({ username: username }).exec();
    if (!!user) {
      return user;
    } else {
      return null;
    }
  }
  async findUserByPassport(query: any) {
    const user = await this.model.findOne(query).exec();
    if (!!user) {
      return user;
    } else {
      return null;
    }
  }

  async countTotalUsers() {
    const total = await this.model.count({ level: 1, isActive: true });
    return {
      total: total,
      statusCode: 200,
    };
  }
}

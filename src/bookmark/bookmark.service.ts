import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {
         
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            }
        })

        return bookmark
    }

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId: userId
            }
        })
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId: userId
            }
        })
    }

    async editBookmarkByid(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Unauthorized operation')

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })

        if (!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Unauthorized operation')

        await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}

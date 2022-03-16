import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
//id는 db에서 유니크한 값이므로 아직 db를 사용하지 않아 임시로 만들어 유니크값을준다
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  //prvaite 를 사용하는 이유: 다른 컴포넌트에서 보드라는 배열 값을 수정을 할수 있는데,
  //그거를 차단하기 위함이다.
  private boards: Board[] = [];
  //모든 게시물을 가져온다.
  getAllBoards(): Board[] {
    return this.boards; //boards배열에 들어있는 모든 값을 return(getallboards 함수 호출시)
  }
  //게시물 생성
  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto;
    const board: Board = {
      id: uuid(), //유니크한 값을 게시판의 아이디로 줄수 있다.
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);
    return board;
  }

  getBoardById(id: string): Board {
    const foundById = this.boards.find((board) => board.id === id);

    if (!foundById) {
      throw new NotFoundException(`Can't find Board with id${id}`);
    }
    return foundById;
  }
  //return 값을 주지 않을때 void 활용
  deleteBoardById(id: string): void {
    const foundById = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== foundById.id);
  }
  updateBoardStatus(id: string, status: BoardStatus): Board {
    //id를 가진 보드를 먼저 찾아서 그 보드의 값을 바꿔준다.
    //보드에있던 상태가 들어온 값으로 바뀌어야한다.
    const getboard = this.getBoardById(id);
    getboard.status = status;
    return getboard;
  }
}

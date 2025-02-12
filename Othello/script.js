/**
 * $(セレクタ). どんな操作をしたいか
 *
 * タグ     {タグ名}
 * id      #{id}
 * class   .{クラス名}
 * その他    {セレクタ}[{属性}={条件}]
 *
 * テキストを変更する
 * クラスを追加する
 * 属性を変更する
 */

/***********************
 * 定数列挙
 ************************/
BOARD_GRID_NUM = 7;
SQUARE_STATUS_IS_OWNED = "01";  // 自分が所有している
SQUARE_STATUS_IS_OTHER = "02";  // 相手が所有している
SQUARE_STATUS_NOT_SELECTED = "-1";      // 選択されていない

/***********************
 * 変数列挙
 ************************/

let isOddTurn = true;   // ターンを示す変数

/***********************
 * イベント
 ************************/

$(function () {
    // マス目にイベントを設定する
    // "ClickSquareEvent"を呼ぶように設定
    // squareクラスを持つものにクリックしたとき
    $(".square").click(ClickSquareEvent);

    // ゲームの初期化
    InitGame();
});

// マス目クリックイベント
function ClickSquareEvent() {

    // クリックされたマス目のオブジェクトを取得する
    let square = $(this);

    // クリックされたマス目が選択できない場合はスキップ
    if (!CanSelect(square))
        return;

    // マス目の所有者を変更する
    ChangeOwner(square);
}

/***********************
 * 内部関数
 **********************/

// ゲームの初期化
function InitGame() {
    ChangeOwner(GetTargetSquare(3,3));
    ChangeOwner(GetTargetSquare(3,4));
    ChangeOwner(GetTargetSquare(4,4));
    ChangeOwner(GetTargetSquare(4,3));
}
// マス目の所有者を変更する
function ChangeOwner(square) {
    // マス目にピースを置く
    PutPiece(square, GetTurnString());

    // 隣接するピースを反転する
    ChangeOwnerOpposite(square);

    // ターンを変更する　
    isOddTurn = !isOddTurn;

}
// マス目にピースを置く
function PutPiece(targetSquare, owner) {
    targetSquare.text("●").attr("data-owner", owner).addClass("selected");
}

// ターンを示す文字列を取得する
function GetTurnString() {
    return isOddTurn ? "black" : "white";
}

// 指定したマス目のオブジェクトを取得する
function GetTargetSquare(row, col) {
    return $("[data-row=" + row + "][data-col=" + col + "]");
}

//　指定されたマス目が選択できるかを判定する
function CanSelect(square) {
    // すでにピースが設定されている場合は選択不可
    if (square.hasClass("selected"))
    {
        return false;
    }
    return true;
}

// 所有者を変更する
function ChangeOwnerOpposite(square) {
    // クリックされたマス目の位置を取得する
    let row = square.data("row");
    let col = square.data("col");

    // 所有者を変更する
    ChangeOwnerOppositeLower(row, col); // 下
}
// 所有者を変更する（下）
function ChangeOwnerOppositeLower(row,col) {
    // 対向先を取得する
    let endPos = GetPosOppositeLower(row, col);

    if (endPos == null) return;

    // 対向先まで所有者を変更する
    let targetCol = col;

    for (targetRow = row + 1; targetRow < endPos.row; targetRow++){ // 選択した次のマス（真下）から　対向先の最後の列までループ
        //
        let targetSquare = GetTargetSquare(targetRow, targetCol);

        // 色の変更
        PutPiece(targetSquare, GetTurnString());
    }
}

// 対向の所有ますの位置を取得する（下）
function GetPosOppositeLower(row, col) {
    // 基準マスが最端の場合は対向先が存在しない
    if (row == BOARD_GRID_NUM) return null;

    // 隣接ますが相手所有ではない場合は対向先が存在しない
    let targetRow = row + 1;
    let targetCol = col;
    if (GetSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) return null;

    // 対向先の有無を判定する
    for (targetRow++; targetRow <= BOARD_GRID_NUM; targetRow++) {
        // マスの状態を取得する
        let status = GetSquareStatus(targetRow, targetCol);

        // 選択されていないマスに到達した場合は終了する
        if (status == SQUARE_STATUS_NOT_SELECTED) return null;

        // 自分の所有マスに到達した場合、位置を返却する
        if (status == SQUARE_STATUS_IS_OWNED) {
            return { row: targetRow, col: targetCol };
        }
    }
    return null;
}
// 対象のマス目の状態を取得する
function GetSquareStatus(row, col) {
    // マス目の取得
    let targetSquare = GetTargetSquare(row, col);

    // selectedクラスを持っていなければ未選択
    if (!targetSquare.hasClass("selected"))
        return SQUARE_STATUS_NOT_SELECTED;

    // 自分が所有している
    if (GetTurnString() == targetSquare.attr("data-owner"))
        return SQUARE_STATUS_IS_OWNED;

    // それ以外　＝　相手が所有
    return SQUARE_STATUS_IS_OTHER;
}

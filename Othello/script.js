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
 * イベント
 ************************/

$(function () {
    // マス目にイベントを設定する
    // "ClickSquareEvent"を呼ぶように設定
    // squareクラスを持つものにクリックしたとき
    $(".square").click(ClickSquareEvent);

});

// マス目クリックイベント
function ClickSquareEvent() {
    // クリックされたマス目のオブジェクトを取得する
    let square = $(this);

    // マス目にピースを置く
    PutPiece(square, "black");
}

/***********************
 * 内部関数
 **********************/

// マス目にピースを置く
function PutPiece(targetSquare, owner) {
    targetSquare.text("●").attr("data-owner", owner).addClass("selected");
}

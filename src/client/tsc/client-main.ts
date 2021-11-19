import $ from "jquery";

function getMessage(name: string): string {
  return `Hello, ${name}!`;
}

$(function () {
  $("#btn").on("click", function () {
    const name = $("#name").val() as string;
    alert(getMessage(name));
  });
});

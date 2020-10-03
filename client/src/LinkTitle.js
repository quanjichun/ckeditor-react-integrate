import Plugin from "@ckeditor/ckeditor5-core/src/plugin";


class LinkTitle extends Plugin {
    init() {
      const editor = this.editor;
  
      editor.model.schema.extend("$text", { allowAttributes: "titleTarget" });
  
      editor.conversion.for("downcast").attributeToElement({
        model: "titleTarget",
        view: (attributeValue, { writer }) => {
          const titleElement = writer.createAttributeElement(
            "a",
            { title: attributeValue },
            { priority: 5 }
          );
          writer.setCustomProperty("link", true, titleElement);
  
          return titleElement;
        },
        converterPriority: "low",
      });
  
      editor.conversion.for("upcast").attributeToAttribute({
        view: {
          name: "a",
          key: "title",
        },
        model: "titleTarget",
        converterPriority: "low",
      });
    }
  }

  export default LinkTitle;
  